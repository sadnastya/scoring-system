import csv
from datetime import datetime

from flask import Blueprint, jsonify, make_response, request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from quotes.config import db
from quotes.utils import token_required

bp = Blueprint("dwh", __name__)


def apply_filters(base_query, filters):
    query_filters = {}
    if "product_type" in filters:
        base_query += " AND product_type = :product_type"
        query_filters["product_type"] = filters["product_type"]
    if "model_name" in filters:
        base_query += " AND model_name = :model_name"
        query_filters["model_name"] = filters["model_name"]
    if "is_insurance_case" in filters:
        base_query += " AND is_insurance_case = :is_insurance_case"
        query_filters["is_insurance_case"] = filters["is_insurance_case"] in [
            "true",
            "1",
            True,
        ]
    if "feature_name" in filters:
        base_query += " AND feature_name = :feature_name"
        query_filters["feature_name"] = filters["feature_name"]
    if "start_date" in filters:
        try:
            query_filters["start_date"] = datetime.strptime(
                filters["start_date"], "%Y-%m-%d"
            )
            base_query += " AND start_date >= :start_date"
        except ValueError:
            raise ValueError("Invalid start_date format. Use YYYY-MM-DD.")
    if "end_date" in filters:
        try:
            query_filters["end_date"] = datetime.strptime(
                filters["end_date"], "%Y-%m-%d"
            )
            base_query += " AND end_date <= :end_date"
        except ValueError:
            raise ValueError("Invalid end_date format. Use YYYY-MM-DD.")
    return base_query, query_filters


@bp.route("/", methods=["GET", "POST"])
@token_required
def get_data(user):
    base_query = """
    SELECT product_type, run_id, quote_id, briefcase_date, start_date, end_date,
    model_name, feature_name, feature_value, predict, is_insurance_case,
    data_insurance_case
    FROM dwh.data_mart
    WHERE 1=1
    """  # noqa E501

    count_query = """
    SELECT COUNT(*)
    FROM dwh.data_mart
    WHERE 1=1
    """
    filters = {}
    if request.method == "POST":
        incoming_filters = request.json or {}
    else:
        incoming_filters = request.args.to_dict()

    try:
        base_query, query_filters = apply_filters(base_query, incoming_filters)
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
    except ValueError:
        return jsonify({"error": "Invalid pagination parameters"}), 400
    if (page and page < 1) or (page and per_page) < 1:
        return (
            jsonify({"error": "Pagination parameters must be positive"}),
            400,
        )
    offset = (page - 1) * per_page
    base_query += " LIMIT :per_page OFFSET :offset"

    filters["per_page"] = per_page
    filters["offset"] = offset
    try:
        total_records = db.session.execute(text(count_query), filters).scalar()
        result = db.session.execute(text(base_query), filters).mappings()
        rows = [dict(row) for row in result]
        total_pages = (total_records + per_page - 1) // per_page
        db.session.commit()
        return (
            jsonify(
                {
                    "page": page,
                    "total_pages": total_pages,
                    "total_records": total_records,
                    "per_page": per_page,
                    "data": rows,
                }
            ),
            200,
        )
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.session.close()


@bp.route("/export", methods=["POST"])
@token_required
def export_data(user):
    base_query = """
    SELECT product_type, run_id, quote_id, briefcase_date, start_date, end_date,
    model_name, feature_name, feature_value, predict, is_insurance_case,
    data_insurance_case
    FROM dwh.data_mart
    WHERE 1=1
    """  # noqa E501
    filters = request.json or {}

    try:
        base_query, query_filters = apply_filters(base_query, filters)
        result = db.session.execute(text(base_query), query_filters).mappings()
        rows = [dict(row) for row in result]

        # Создаём CSV
        csv_file = "exported_dwh_data.csv"
        with open(csv_file, "w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(
                file,
                fieldnames=[
                    "product_type",
                    "run_id",
                    "quote_id",
                    "briefcase_date",
                    "start_date",
                    "end_date",
                    "model_name",
                    "feature_name",
                    "feature_value",
                    "predict",
                    "is_insurance_case",
                    "data_insurance_case",
                ],
            )
            writer.writeheader()
            writer.writerows(rows)

        with open(csv_file, "r", encoding="utf-8") as file:
            response = make_response(file.read())
            response.headers["Content-Disposition"] = (
                f"attachment; filename={csv_file}"
            )
            response.headers["Content-Type"] = "text/csv"
            return response

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.session.close()
