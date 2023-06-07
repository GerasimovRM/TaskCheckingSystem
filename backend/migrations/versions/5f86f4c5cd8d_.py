"""empty message

Revision ID: 5f86f4c5cd8d
Revises: c21fdd16d210
Create Date: 2023-06-07 20:08:30.142586

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5f86f4c5cd8d'
down_revision = 'c21fdd16d210'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dbo_user', sa.Column('login', sa.String(length=40), nullable=True))
    op.create_unique_constraint(None, 'dbo_user', ['login'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dbo_user', type_='unique')
    op.drop_column('dbo_user', 'login')
    # ### end Alembic commands ###