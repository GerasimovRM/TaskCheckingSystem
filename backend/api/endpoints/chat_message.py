from typing import Optional, List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from models.pydantic_sqlalchemy_core import ChatMessageDto
from services.auth_service import get_current_active_user
from database import get_session, ChatMessage
from services.chat_message_service import ChatMessageService

router = APIRouter(
    prefix="/chat_message",
    tags=["chat_message"]
)


@router.get("/get_all", response_model=List[ChatMessageDto])
async def get_messages(group_id: int,
                       course_id: int,
                       task_id: int,
                       user_id: Optional[int] = None,
                       current_user=Depends(get_current_active_user),
                       session: AsyncSession = Depends(get_session)) -> List[ChatMessageDto]:
    chat_messages = await ChatMessageService.get_chat_messages(group_id,
                                                               course_id,
                                                               task_id,
                                                               (user_id if user_id else current_user.id),
                                                               session)
    return list(map(ChatMessageDto.from_orm, chat_messages))


@router.post("/post_one")
async def post_message(group_id: int,
                       course_id: int,
                       task_id: int,
                       message_text: str,
                       user_id: Optional[int] = None,
                       current_user=Depends(get_current_active_user),
                       session: AsyncSession = Depends(get_session)):
    cm = ChatMessage(task_id=task_id,
                     user_id=(user_id if user_id else current_user.id),
                     course_id=course_id,
                     group_id=group_id,
                     message_text=message_text,
                     from_id=current_user.id)
    session.add(cm)
    await session.commit()
    return ChatMessageDto.from_orm(cm)
