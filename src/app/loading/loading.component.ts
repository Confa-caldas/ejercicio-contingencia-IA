import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitiesServiceService } from '../services/utilities.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {

  constructor(
    public utilitiesService: UtilitiesServiceService
  ) { }

  ngOnInit(): void {}
}
