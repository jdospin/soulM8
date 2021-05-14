import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SoulM8 Dating';
  users: any;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.setCurrentUser(null);
  }
  
  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accountService.setCurrentUser(user);
  }
}
