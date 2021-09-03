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

  arr = [];

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
        this.letterStream$.pipe(map(letter => number + ' : ' + letter))
      )
    );

    // switchmap
    this.switchMappedObservableStream = this.numberStream$.pipe(
      switchMap(number =>
        this.letterStream$.pipe(map(letter => number + ' : ' + letter))
      )
    );

    // concatmap
    this.concatMappedObservableStream = this.numberStream$.pipe(
      concatMap(number =>
        this.letterStream$.pipe(map(letter => number + ' : ' + letter))
      )
    );

    // exhaustmap
    this.exhaustMappedObservableStream = this.numberStream$.pipe(
      exhaustMap(number =>
        this.letterStream$.pipe(map(letter => number + ' : ' + letter))
      )
    );

    //subscription------
    let self = this;
    this.clearArray();
    this.currentSubscription = this.flatMappedObservableStream.subscribe(
      res => {
        console.log(res);
        self.arr.push(res);
      }
    );
  }

  addSubscription(stream) {
    let self = this;
    self.currentSubscription = stream.subscribe(res => {
      console.log(res);
      self.arr.push(res);
    });
  }

  onChangeOperator() {
    console.log(`Operator is ${this.selectedOperator}`);
    this.unsubscribeCurrentSubscription();
    this.clearArray();

    switch (this.selectedOperator) {
      case 'switchMap':
        this.addSubscription(this.switchMappedObservableStream);
        break;
      case 'concatMap':
        this.addSubscription(this.concatMappedObservableStream);
        break;
      case 'exhaustMap':
        this.addSubscription(this.exhaustMappedObservableStream);
        break;
      default:
        this.addSubscription(this.flatMappedObservableStream);
    }
  }

  clearArray() {
    this.arr = [];
  }

  unsubscribeCurrentSubscription() {
    this.currentSubscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.clearArray();
    this.unsubscribeCurrentSubscription();
  }
}
