import { Component, OnInit } from '@angular/core';
import { ApplicationPage, ApplicationTitle } from '~store/common/navigation/types/application-page';
import { ConfigService } from '~services/config.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'dsov-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public APPLICATION_PAGE = ApplicationPage;
  public dateIwt: Date; // datum in werking treding omgevingswet

  constructor(private configService: ConfigService, private titleService: Title) {
    this.dateIwt = new Date(this.configService.config.iwt.date);
  }

  public ngOnInit(): void {
    this.titleService.setTitle(ApplicationTitle);
  }

  public getVergunningsCheckUrl(): string {
    return this.configService.config.vergunningsCheck.url;
  }

  public isIhrDisabled(): boolean {
    return this.configService.config.ihr.disabled;
  }
}
