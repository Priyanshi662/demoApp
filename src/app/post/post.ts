import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { LucideAngularModule, X, Pen} from 'lucide-angular';

@Component({
  selector: 'app-post',
  imports: [HlmCardImports,LucideAngularModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
     cross= X;
     editIcon= Pen;
}
