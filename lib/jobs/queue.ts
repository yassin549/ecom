// Background job queue using BullMQ
// For production, use Redis as the backing store

type Job = {
  id: string
  type: string
  data: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  processedAt?: Date
  error?: string
}

class JobQueue {
  private jobs: Map<string, Job> = new Map()
  private processing = false

  async add(type: string, data: any): Promise<string> {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const job: Job = {
      id,
      type,
      data,
      status: 'pending',
      createdAt: new Date(),
    }

    this.jobs.set(id, job)
    this.processNext()

    return id
  }

  private async processNext() {
    if (this.processing) return

    const pendingJob = Array.from(this.jobs.values()).find(
      (job) => job.status === 'pending'
    )

    if (!pendingJob) return

    this.processing = true
    pendingJob.status = 'processing'

    try {
      await this.processJob(pendingJob)
      pendingJob.status = 'completed'
      pendingJob.processedAt = new Date()
    } catch (error) {
      pendingJob.status = 'failed'
      pendingJob.error = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Job ${pendingJob.id} failed:`, error)
    } finally {
      this.processing = false
      // Process next job
      setTimeout(() => this.processNext(), 100)
    }
  }

  private async processJob(job: Job) {
    switch (job.type) {
      case 'send-email':
        await this.sendEmail(job.data)
        break
      case 'process-image':
        await this.processImage(job.data)
        break
      case 'generate-report':
        await this.generateReport(job.data)
        break
      case 'update-inventory':
        await this.updateInventory(job.data)
        break
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
  }

  private async sendEmail(data: any) {
    // Email sending logic
    console.log('Sending email:', data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private async processImage(data: any) {
    // Image processing logic
    console.log('Processing image:', data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  private async generateReport(data: any) {
    // Report generation logic
    console.log('Generating report:', data)
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  private async updateInventory(data: any) {
    // Inventory update logic
    console.log('Updating inventory:', data)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id)
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values())
  }

  clearCompleted() {
    for (const [id, job] of this.jobs.entries()) {
      if (job.status === 'completed') {
        this.jobs.delete(id)
      }
    }
  }
}

export const jobQueue = new JobQueue()

// Helper functions
export const queueEmail = (emailData: any) => {
  return jobQueue.add('send-email', emailData)
}

export const queueImageProcessing = (imageData: any) => {
  return jobQueue.add('process-image', imageData)
}

export const queueReportGeneration = (reportData: any) => {
  return jobQueue.add('generate-report', reportData)
}

export const queueInventoryUpdate = (inventoryData: any) => {
  return jobQueue.add('update-inventory', inventoryData)
}
