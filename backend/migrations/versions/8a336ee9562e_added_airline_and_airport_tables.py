"""Added Airline and Airport tables

Revision ID: 8a336ee9562e
Revises: ffd2f6de8b14
Create Date: 2024-12-07 01:25:06.844653

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a336ee9562e'
down_revision = 'ffd2f6de8b14'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('airlines',
    sa.Column('id', sa.String(length=10), nullable=False),
    sa.Column('airline_id', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('airports',
    sa.Column('id', sa.String(length=10), nullable=False),
    sa.Column('airport_id', sa.String(length=100), nullable=False),
    sa.Column('timezone', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('airports')
    op.drop_table('airlines')
    # ### end Alembic commands ###
