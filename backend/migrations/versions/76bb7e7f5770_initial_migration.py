"""Initial migration

Revision ID: 76bb7e7f5770
Revises: 
Create Date: 2024-12-06 21:45:31.886735

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '76bb7e7f5770'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('flights',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('flight_number', sa.String(length=20), nullable=False),
    sa.Column('origin', sa.String(length=50), nullable=False),
    sa.Column('destination', sa.String(length=50), nullable=False),
    sa.Column('departure_time', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('flight_number')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('trackers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('flight_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['flight_id'], ['flights.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trackers')
    op.drop_table('users')
    op.drop_table('flights')
    # ### end Alembic commands ###
