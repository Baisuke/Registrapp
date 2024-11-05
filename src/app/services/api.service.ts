import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) { }
  getPosts() {
    return this.http.get(`${this.apiUrl}`);
  }
  getPost(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createPost(post: any) {
    return this.http.post(this.apiUrl, post);
  }
  updatePost(id: number, post: any) {
    return this.http.put(`${this.apiUrl}/${id}`, post);
  }
  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
