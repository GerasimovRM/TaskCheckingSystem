from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from models.pydantic_sqlalchemy_core import CourseDto, CoursesLessonsDto
from models.site.course import CoursesResponse, CourseResponse, CoursePutRequest
from services.auth_service import get_admin, get_teacher_or_admin
from database import Group, get_session, GroupsCourses, CoursesLessons
from services.course_service import CourseService
from api.deps import get_user_group, get_group_by_id_with_courses, get_group_course_with_courses, \
    get_group_course, get_course_lesson

router = APIRouter(
    prefix="/course",
    tags=["course"]
)


@router.get("/get_all", response_model=CoursesResponse, dependencies=[
    Depends(get_user_group),
])
async def get_courses(group: Group = Depends(get_group_by_id_with_courses)) -> CoursesResponse:
    return CoursesResponse(courses=list(map(lambda t: CourseDto.from_orm(t.course), group.courses)))


@router.get("/get_one", response_model=CourseResponse, dependencies=[
    Depends(get_user_group)
])
async def get_courses(g_c: GroupsCourses = Depends(get_group_course_with_courses)) -> CourseResponse:
    return CourseResponse.from_orm(g_c.course)


@router.put("/", response_model=CourseResponse, dependencies=[
    Depends(get_admin)
])
async def put_course(course_request: CoursePutRequest,
                     session: AsyncSession = Depends(get_session)):
    course = await CourseService.get_course(course_request.id, session)
    course.update_by_pydantic(course_request)
    await session.commit()
    return CourseResponse.from_orm(course)


@router.delete("/", dependencies=[
    Depends(get_admin)
])
async def delete_course(course_id: int,
                        session: AsyncSession = Depends(get_session)):
    course = await CourseService.get_course(course_id, session)
    await session.delete(course)
    return {"detail": "ok"}


@router.post("/change_visibility", response_model=CoursesLessonsDto, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_teacher_or_admin)
])
async def change_visibility(is_hidden: bool,
                            course_lesson: CoursesLessons = Depends(get_course_lesson),
                            session: AsyncSession = Depends(get_session)):
    course_lesson.is_hidden = is_hidden
    await session.commit()
    return CoursesLessonsDto.from_orm(course_lesson)
