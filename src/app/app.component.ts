import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  titles: string[] = [];
  title: string;

  // @ViewChild("button") button: ElementRef;

  ngOnInit(): void {

    this.titles[0] = 'A/B testing';
    this.titles[1] = 'A/B test testing';

    this.title = this.titles[Math.floor(Math.random() * 100) % 2];
  }
}
