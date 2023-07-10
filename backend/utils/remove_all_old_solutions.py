import asyncio
from itertools import groupby

from sqlalchemy import select

from database import get_sync_session, User, Solution
from database.solution import SolutionStatus
from services.user_service import UserService


def main():
    session = get_sync_session()
    print(session)
    users = session.query(User).all()
    for user in users:
        print(user)
        solutions = session.query(Solution).where(Solution.user_id == user.id)
        for key, group_solution in groupby(sorted(solutions, key=lambda s: s.task_id), key=lambda sol: sol.task_id):
            # print(key)
            sols = sorted(filter(lambda x: x, group_solution), key=lambda sol: sol.id)
            # print(sols)
            if len(sols) > 1:
                # print(sols)
                current_sol = max(sols, key=lambda x: (x.status, x.id))
                sols.remove(current_sol)
                for sol in filter(lambda x: x.status != SolutionStatus.COMPLETE, sols):
                    session.delete(sol)
            session.commit()



if __name__ == "__main__":
    main()
