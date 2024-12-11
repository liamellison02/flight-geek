"""add skyId to airport

Revision ID: 940d361c53f0
Revises: f41df0d33774
Create Date: 2024-12-07 02:33:20.127580

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '940d361c53f0'
down_revision = 'f41df0d33774'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('airports', schema=None) as batch_op:
        batch_op.add_column(sa.Column('skyId', sa.String(length=10), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('airports', schema=None) as batch_op:
        batch_op.drop_column('skyId')

    # ### end Alembic commands ###