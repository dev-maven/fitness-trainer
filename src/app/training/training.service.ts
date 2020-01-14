// import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';


import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { take } from 'rxjs/operators';


@Injectable()
export class TrainingService {
    // exerciseChanged = new Subject<Exercise>();
    // exercisesChanged = new Subject<Exercise[]>();
    // finishedExercisesChanged = new Subject<Exercise[]>();
     private fbSubs: Subscription[] = [];

    // private availableExercises: Exercise[] = [];

    // private runningExercise: Exercise;

    constructor(private db: AngularFirestore, private uiService: UIService,
        private store: Store<fromTraining.State> ) {}

    fetchAvailableExercises() {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map( doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories,
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
         this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        //   this.uiService.loadingStateChanged.next(false);
        //   this.availableExercises = exercises;
        //   this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
          this.store.dispatch(new UI.StopLoading());
        //   this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Fetching Exercises failed', null, 3000);
        //   this.exerciseChanged.next(null);
      }));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
        // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        // this.exerciseChanged.next({... this.runningExercise });
    }

    // getRunningExercise() {
    //     return { ...this.runningExercise };
    // }

    fetchCompletedOrCancelledExercises() {
        // return this.exercises.slice();
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
                // this.finishedExercisesChanged.next(exercises);
            }));
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    completeExercise() {

        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
                });
                this.store.dispatch(new Training.StopTraining());
        });

        // this.addDataToDatabase({ ...this.runningExercise,
        //     date: new Date(),
        //     state: 'completed'
        //     });
        //     this.store.dispatch(new Training.StopTraining());


            // this.runningExercise = null;
            // this.exerciseChanged.next(null);



        // this.exercises.push({ ...this.runningExercise,
        // date: new Date(),
        // state: 'completed'
        // });
        // this.runningExercise = null;
        // this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {

        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
                });
                this.store.dispatch(new Training.StopTraining());
        });

        // this.addDataToDatabase({ ...this.runningExercise,
        //     duration: this.runningExercise.duration * (progress / 100),
        //     calories: this.runningExercise.calories * (progress / 100),
        //     date: new Date(),
        //     state: 'cancelled'
        //     });
        //     this.store.dispatch(new Training.StopTraining());


            // this.runningExercise = null;
            // this.exerciseChanged.next(null);



        // this.exercises.push({ ...this.runningExercise,
        //     duration: this.runningExercise.duration * (progress / 100),
        //     calories: this.runningExercise.calories * (progress / 100),
        //     date: new Date(),
        //     state: 'cancelled'
        //     });
        //     this.runningExercise = null;
        //     this.exerciseChanged.next(null);
    }
}
