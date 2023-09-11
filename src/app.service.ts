import { Injectable } from '@nestjs/common';
import { PoolService } from './pool/pool.service';
import { Project } from './project.interface';

@Injectable()
export class AppService {
  constructor(private readonly poolService: PoolService) {}

  async readDatabase(): Promise<any> {
    const [databaseTable] = await this.poolService.pool.query('SELECT * FROM projects');
    return databaseTable;
  }

  private async executeQuery(query: string, params: any[]): Promise<void> {
    try {
      await this.poolService.pool.execute(query, params);
    } catch (error) {
      console.error(`Error executing query: ${query}`, error);
      throw error;
    }
  }

  async createRow(project: Project): Promise<void> {
    const query = 'INSERT INTO projects (reference, description) VALUES (?, ?)';
    await this.executeQuery(query, [project.reference, project.description]);
  }

  async updateRow(project: Project): Promise<void> {
    const query = 'UPDATE projects SET reference = ?, description = ? WHERE id = ?';
    await this.executeQuery(query, [project.reference, project.description, project.id]);
  }

  async deleteRow(project: Project): Promise<void> {
    const query = 'DELETE FROM projects WHERE id = ?';
    await this.executeQuery(query, [project.id]);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
