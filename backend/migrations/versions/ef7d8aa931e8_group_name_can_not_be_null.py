"""group name can not be null

Revision ID: ef7d8aa931e8
Revises: f852c6cf629c
Create Date: 2021-07-02 16:52:39.218315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef7d8aa931e8'
down_revision = 'f852c6cf629c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('dbo_group', 'name',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
    op.create_unique_constraint(None, 'dbo_group', ['name'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dbo_group', type_='unique')
    op.alter_column('dbo_group', 'name',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
    # ### end Alembic commands ###
