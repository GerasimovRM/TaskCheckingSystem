from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.users_groups import UserGroupRole, UsersGroups
from models.pydantic_sqlalchemy_core import LessonDto
from models.site.lesson import LessonsResponse, LessonResponse, LessonPostRequest, LessonRequest, \
    LessonDtoWithHiddenFlag
from services.auth_service import get_current_active_user, get_teacher_or_admin
from database import get_session, Course, CoursesLessons, Lesson
from services.lesson_service import LessonService
from api.deps import get_user_group, get_group_course, get_course, get_course_lessons, get_lesson, \
    get_course_lesson

router = APIRouter(
    prefix="/lesson",
    tags=["lesson"]
)


@router.get("/get_all", response_model=LessonsResponse, dependencies=[
    Depends(get_group_course)
])
async def get_lessons(user_group: UsersGroups = Depends(get_user_group),
                      course: Course = Depends(get_course),
                      course_lessons: CoursesLessons = Depends(get_course_lessons)) -> LessonsResponse:
    if user_group.role == UserGroupRole.STUDENT:
        lessons_dto = list(map(lambda t: LessonDto.from_orm(t.lesson),
                               filter(lambda c_l: not c_l.is_hidden, course_lessons)))
    else:
        lessons_dto = list(map(lambda t: LessonDtoWithHiddenFlag(**t.lesson.to_dict(),
                                                                 is_hidden=t.is_hidden),
                               course_lessons))
    return LessonsResponse(lessons=lessons_dto,
                           course_name=course.name,
                           course_description=course.description)


@router.get("/get_one", response_model=LessonResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course)
])
async def get_lesson(course_lesson: CoursesLessons = Depends(get_course_lesson)) -> LessonResponse:
    return LessonResponse.from_orm(course_lesson.lesson)


@router.post("/", response_model=LessonResponse, dependencies=[
    Depends(get_teacher_or_admin)
])
async def post_lesson(lesson_request: LessonPostRequest,
                      session: AsyncSession = Depends(get_session)) -> LessonResponse:
    lesson = Lesson(**lesson_request.dict())
    session.add(lesson)
    await session.commit()
    return LessonResponse.from_orm(lesson)


@router.put("/", response_model=LessonResponse, dependencies=[
    Depends(get_teacher_or_admin)
])
async def put_lesson(lesson_request: LessonRequest,
                     session: AsyncSession = Depends(get_session)) -> LessonResponse:
    # как всунуть dependency, когда тут не просто id, а целый request?
    lesson = await LessonService.get_lesson(lesson_request.id, session)
    lesson.update_by_pydantic(lesson_request)
    await session.commit()
    return LessonResponse.from_orm(lesson)


@router.delete("/", dependencies=[
    Depends(get_current_active_user)
])
async def delete_lesson(lesson: Lesson = Depends(get_lesson),
                        session: AsyncSession = Depends(get_session)):
    await session.delete(lesson)
    return {"detail": "ok"}  # TODO: common classes
