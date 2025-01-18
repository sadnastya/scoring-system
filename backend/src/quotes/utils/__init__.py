# from quotes.utils.db_tables import execute_all, execute_sql
from quotes.utils.input import token_required, validate_input_data
from quotes.utils.users import (
    AdminProfileManager,
    UserProfileManager,
    create_admin,
    is_admin,
    apply_filters,
    admin_required,
)
from quotes.utils.db_tables import bulk_insert_core_data
from quotes.utils.quotes_manager import QuoteManager
