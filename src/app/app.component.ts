import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, pipe, Subscription } from 'rxjs';
import {
  concatMap,
  exhaustMap,
  map,
  switchMap,
  flatMap,
  take
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  selectedOperator: string = 'flatMap';

  flatMappedObservableStream: Observable<any>;
  switchMappedObservableStream: Observable<any>;
  concatMappedObservableStream: Observable<any>;
  exhaustMappedObservableStream: Observable<any>;

  currentSubscription: Subscription;

  // create number stream
  numberStream$ = interval(1000).pipe(take(3));

  // create character stream
  a = 'a'.charCodeAt(0);
  letterStream$ = interval(500).pipe(
    take(3),
    map(i => String.fromCharCode(i + this.a))
  );

  ngOnInit(): void {
    console.log(`Operator is ${this.selectedOperator}`);
    // flatmap
    this.flatMappedObservableStream = this.numberStream$.pipe(
      flatMap(number =>
        this.letterStream$.pipe(map(letter => [number, letter]))
      )
    );

    // switchmap
    this.switchMappedObservableStream = this.numberStream$.pipe(
      switchMap(number =>
        this.letterStream$.pipe(map(letter => [number, letter]))
      )
    );

    // concatmap
    this.concatMappedObservableStream = this.numberStream$.pipe(
      concatMap(number =>
        this.letterStream$.pipe(map(letter => [number, letter]))
      )
    );

    // exhaustmap
    this.exhaustMappedObservableStream = this.numberStream$.pipe(
      exhaustMap(number =>
        this.letterStream$.pipe(map(letter => [number, letter]))
      )
    );

    //subscription------

    this.currentSubscription = this.flatMappedObservableStream.subscribe(res =>
      console.log(res)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeCurrentSubscription();
  }

  unsubscribeCurrentSubscription() {
    this.currentSubscription.unsubscribe();
  }

  onChangeOperator() {
    console.log(`Operator is ${this.selectedOperator}`);
    this.unsubscribeCurrentSubscription();

    switch (this.selectedOperator) {
      case 'switchMap':
        this.currentSubscription = this.switchMappedObservableStream.subscribe(
          res => console.log(res)
        );
        break;
      case 'concatMap':
        this.currentSubscription = this.concatMappedObservableStream.subscribe(
          res => console.log(res)
        );
        break;
      case 'exhaustMap':
        this.currentSubscription = this.exhaustMappedObservableStream.subscribe(
          res => console.log(res)
        );
        break;
      default:
        this.currentSubscription = this.flatMappedObservableStream.subscribe(
          res => console.log(res)
        );
    }
  }
}
