"""empty message

Revision ID: a0eba5e5c3bf
Revises: a3fdaee32196
Create Date: 2023-02-14 23:34:47.118285

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a0eba5e5c3bf'
down_revision = 'a3fdaee32196'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dbo_solution', sa.Column('input_data', sa.Text(), nullable=True))
    op.add_column('dbo_solution', sa.Column('except_answer', sa.Text(), nullable=True))
    op.add_column('dbo_solution', sa.Column('user_answer', sa.Text(), nullable=True))
    op.add_column('dbo_solution', sa.Column('unit_test_code', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('dbo_solution', 'unit_test_code')
    op.drop_column('dbo_solution', 'user_answer')
    op.drop_column('dbo_solution', 'except_answer')
    op.drop_column('dbo_solution', 'input_data')
    # ### end Alembic commands ###