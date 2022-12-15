import { inject, observable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { MESSAGES } from "config/config";
import { Contest, Problem, Enums } from "models/models";
import { Alert, Auth, Contests } from "services/services";

@inject(Alert, Auth, Contests, Router)
export class ContestProblems {
  @observable now;
  @observable dateLoaded;
  @observable problemsLoaded;

  /**
   * Inicializa la instancia.
   */
  constructor(alertService, authService, contestService, router) {
    this.alertService = alertService;
    this.authService = authService;
    this.contestService = contestService;
    this.router = router;
    this.contest = new Contest();
    this.problems;
    this.creatorId = 0;
    this.status = "unverified";
    this.key = "";
    this.flagProblems = false;
    this.contTime = {};
    this.enums = Enums;
  }
  /**
   * Método que toma los parametros enviados en el link y configura la página para adaptarse
   * al contenido solicitado. Este método hace parte del ciclo de vida de la aplicación y se
   * ejecuta automáticamente luego de lanzar el constructor.
   * @param {any} params
   * @param {any} routeConfig
   */
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.id = params.id;
    this.flagProblems = false;
    this.getContest();
  }

  problemsLoadedChanged(act, prev) {
    this.validateShow();
  }

  dateLoadedChanged(act, prev) {
    this.validateShow();
  }

  validateShow() {
    if (this.dateLoaded && this.problemsLoaded) {
      if (this.now < this.startDate) {
        this.router.navigateToRoute("detail", { id: this.id });
        this.alertService.showMessage(MESSAGES.contestNotStarted);
      } else {
        this.flagProblems = true;
      }
    }
  }

  /**
   * Obtiene la información de la maratón actual.
   */
  getContest() { 
    this.contestService
      .getProblemsContest(this.id)
      .then((data) => {
        this.contest = new Contest(
          data.contest.title,
          data.contest.description,
          data.contest.init_date,
          data.contest.end_date,
          data.contest.rules,
          data.contest.public,
          null,
          this.id,
          (data.contest.type.toString())
        );
        this.problems = [];
        this.creatorId = data.contest.user_id;
        this.startDate = new Date(data.contest.init_date);
        this.endDate = new Date(data.contest.end_date);
        this.problemsLoaded = true;
        if (
          !this.contest.privacy &&
          this.authService.getUserId() !== this.creatorId
        )
          this.getStatus();
        for (let i = 0; i < data.contest.problems.length; i++) {
          this.problems.push(
            new Problem(
              data.contest.problems[i].id,
              data.contest.problems[i].title_en,
              data.contest.problems[i].title_es
            )
          );
          this.problems[i].auxiliarId =
            data.contest.problems[i].contests_problems.id;
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError);
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
  }

  /**
   * Obtiene el estado actual del estudiante en una maratón.
   */
  getStatus() {
    this.contestService
      .getStatus(this.id, this.authService.getUserId())
      .then((data) => {
        this.status = data.status;
        if (this.status !== "registered") {
          this.router.navigateToRoute("detail", { id: this.id });
          this.alertService.showMessage(MESSAGES.contestProblemsNotRegistered);
        }
      })
      .catch((error) => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError);
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError);
        } else {
          this.alertService.showMessage(MESSAGES.unknownError);
        }
      });
  }

  letterValue(index) {
    return String.fromCharCode(index + 65);
  }
}
