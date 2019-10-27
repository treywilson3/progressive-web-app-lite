import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent {
    @Input()
    title: string;

    @Input()
    inputArray: Array<any>;
}
