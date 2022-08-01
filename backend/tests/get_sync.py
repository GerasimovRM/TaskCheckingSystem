from database import get_sync_session, Solution

session = get_sync_session()
print(session)
solution = session.query(Solution).get(1)
print(solution)
