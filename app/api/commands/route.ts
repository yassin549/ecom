import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Get user commands
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const commands = await prisma.command.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(commands)
  } catch (error) {
    console.error('Error fetching commands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commands' },
      { status: 500 }
    )
  }
}

// Create new command
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, action, metadata } = body

    if (!name || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const command = await prisma.command.create({
      data: {
        userId: session.user.id,
        name,
        description: description || null,
        action,
        metadata: JSON.stringify(metadata || {}),
      },
    })

    return NextResponse.json(command, { status: 201 })
  } catch (error) {
    console.error('Error creating command:', error)
    return NextResponse.json(
      { error: 'Failed to create command' },
      { status: 500 }
    )
  }
}

// Update command status
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify command belongs to user
    const existingCommand = await prisma.command.findUnique({
      where: { id },
    })

    if (!existingCommand || existingCommand.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Command not found' },
        { status: 404 }
      )
    }

    const command = await prisma.command.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(command)
  } catch (error) {
    console.error('Error updating command:', error)
    return NextResponse.json(
      { error: 'Failed to update command' },
      { status: 500 }
    )
  }
}
