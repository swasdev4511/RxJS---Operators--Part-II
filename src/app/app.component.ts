import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, pipe, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  numSubscription: Subscription;
  letterSubscription: Subscription;

  numberStream$ = interval(1000).pipe(take(3));

  a = 'a'.charCodeAt(0);
  letterStream$ = interval(500).pipe(
    take(3),
    map(i => String.fromCharCode(i + this.a))
  );

  ngOnInit(): void {
    this.numSubscription = this.numberStream$.subscribe(r => console.log(r));
    this.letterSubscription = this.letterStream$.subscribe(r => console.log(r));
  }

  ngOnDestroy(): void {
    this.numSubscription.unsubscribe();
    this.letterSubscription.unsubscribe();
  }
}
