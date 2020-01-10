import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { Subscription } from 'rxjs/Subscription';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // exercises: Observable<any>;
    // exercises: Observable<Exercise[]>;
    exercises: Exercise[];

    private exerciseSubscription: Subscription;
    isLoading = true;
  private loadingSubs: Subscription;


  // @Output() trainingStart = new EventEmitter<void>();
  constructor(private trainingService: TrainingService, 
    private uiService: UIService) {}
    //  private db: AngularFirestore) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      });
    this.exerciseSubscription = this.trainingService.exercisesChanged
    .subscribe(
      exercises => {this.exercises = exercises; }
    );
    this.fetchExercises();
    // this.exercises = this.trainingService.getAvailableExercises();

      // this. exercises = this.db.collection('availableExercises')
      // .valueChanges();

      //to get full doc data with id use snapshot instead of value changes

    // this.db.collection('availableExercises')
    // .valueChanges().subscribe(result => {
    //   console.log(result);
    // });
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }

    if (this.loadingSubs){
      this.loadingSubs.unsubscribe();
    }
  }

}
