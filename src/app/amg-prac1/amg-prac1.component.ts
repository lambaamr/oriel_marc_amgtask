import { Component, EventEmitter, OnInit, Input, Output, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CurParticipantService } from '../participant/cur-participant.service';
import { Participant } from '../participant/participant';
import { ParticipantService } from '../participant/participant.service';

export enum KEY_CODE {
  f = 70,
  j = 74
}

@Component({
  selector: 'tg-amg-prac1',
  templateUrl: './amg-prac1.component.html',
  styleUrls: ['./amg-prac1.component.css'],
  providers: [ ParticipantService ]
})


export class AmgPrac1Component implements OnInit {
  @Input() pracpage: number;
  @Input() text: string;
  @Input() imgSrc: string;
  @Input() maxpracPage: number;
  @Input() pracpages: number[];


  @Output() pracpageChange = new EventEmitter<number>();
  @Output() pracpagesChange = new EventEmitter<number[]>();
  @Output() prackeyPress = new EventEmitter<string>();

  isFixation: boolean;


  constructor(private curParticipantService: CurParticipantService,
              private participantService: ParticipantService,
              private router: Router) { }

  ngOnInit() {
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.isFixation && event.keyCode === KEY_CODE.f) {
      this.setFixation(1000, 'f');
    }

    if (!this.isFixation && event.keyCode === KEY_CODE.j) {
      this.setFixation(1000, 'j');
    }
  }


  setpracPage(pracpage: number): void {
    this.pracpage = pracpage;
    this.pracpageChange.emit(this.pracpage);
    this.pracpagesChange.emit(this.pracpages);
  }

  setFixation(interval: number, key: string): void {
     if (this.pracpages.length > 0) {
       this.isFixation = true;
       setTimeout(() => {
         this.isFixation = false;
         let pracpage = this.pracpages.pop();
         this.setpracPage(pracpage);
         this.prackeyPress.emit(key);
       }, interval);
     } else {
     this.router.navigateByUrl('/part1', { replaceUrl: true })
     }
   }
}
