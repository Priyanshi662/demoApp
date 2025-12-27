import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Post } from './post/post';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { LucideAngularModule,Plus} from 'lucide-angular';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Post, HlmCardImports,LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demoApp');
  addIcon= Plus;
  constructor()
  {

  }
}
