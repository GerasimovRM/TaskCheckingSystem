"""empty message

Revision ID: a3fdaee32196
Revises: f32f10b5df1e
Create Date: 2023-02-13 19:30:40.410067

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3fdaee32196'
down_revision = 'f32f10b5df1e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dbo_task_test', sa.Column('unit_test_code', sa.String(length=10000), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('dbo_task_test', 'unit_test_code')
    # ### end Alembic commands ###