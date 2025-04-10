import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getTasks(): Observable<any> {
    return this.http.get(this.api, { headers: this.getHeaders() });
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.api, task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, { headers: this.getHeaders() });
  }

  reorderTasks(orderedIds: number[]): Observable<any> {
    return this.http.put(`${this.api}/reorder`, { orderedIds }, { headers: this.getHeaders() });
  }
}
