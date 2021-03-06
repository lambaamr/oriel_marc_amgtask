import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { NavButtonComponent } from '../nav-button/nav-button.component';
import { CurParticipantService } from '../participant/cur-participant.service';
import { ParticipantService } from '../participant/participant.service';

@Component({
  selector: 'tg-amg-quiz',
  templateUrl: './amg-quiz.component.html',
  styleUrls: ['./amg-quiz.component.css'],
  providers: [ ParticipantService ]
})

export class AmgQuizComponent {
  answers: { value: string }[] = [
    { value: '0' },
    { value: '0' },
    { value: '0' }
  ]
  answersSubmitted: boolean;
  feedback: {}
  numCorrect: number;
  questions: { question: string, a: string, b: string, ans: string }[];

  constructor(private router: Router,
              private participantService: ParticipantService,
              private curParticipantService: CurParticipantService,
              private http: Http) {
    this.http.get('/assets/amg_attention_check.json')
            .subscribe(res => {
              this.questions = res.json();
            });
    this.http.get('/assets/amg_attention_check_feedback.json')
            .subscribe(res => {
              this.feedback = res.json();
            });
  }

  checkAnswer(): void {
    this.answersSubmitted = true;
    this.numCorrect = this.answers.map((answer, idx) => {
      return +(answer.value === this.questions[idx].ans);
    })
    .reduce((total, current) => {return total + current}, 0);
    this.curParticipantService.numCorrect = this.numCorrect;
    this.participantService.updateParticipant(this.curParticipantService.participant)
                            .subscribe();
  }

  isValid(): boolean {
    let numAnswered = 0;
    this.answers.forEach(answer => {
      if (parseInt(answer.value) > 0)
        numAnswered++;
    });
    return numAnswered === 3;
  }
}
