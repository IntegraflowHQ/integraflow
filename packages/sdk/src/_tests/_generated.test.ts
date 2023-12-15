/* eslint-disable no-console */
import * as I from "../index";
import { startClient, stopClient } from "./test-client";

/** Auto generated API tests */
describe("generated", () => {
    /** Initialize Integraflow client variable */
    let client: I.IntegraflowClient;

    beforeEach(() => {
        jest.useFakeTimers();
    });

    beforeAll(async () => {
        client = await startClient();
    });

    afterAll(() => {
        stopClient();
    });

    // _Service - no model for query

    /** Test Channels query */
    describe("Channels", () => {
        /** Test the root model query for Channels */
        it("channels", async () => {
            const channels:
                | I.SurveyChannelCountableConnection
                | undefined = await client.channels("mock-id");
            expect(channels instanceof I.SurveyChannelCountableConnection);
        });
    });

    /** Test EventDefinitions query */
    describe("EventDefinitions", () => {
        /** Test the root model query for EventDefinitions */
        it("eventDefinitions", async () => {
            const eventDefinitions:
                | I.EventDefinitionCountableConnection
                | undefined = await client.eventDefinitions();
            expect(
                eventDefinitions instanceof I.EventDefinitionCountableConnection
            );
        });
    });

    /** Test EventProperties query */
    describe("EventProperties", () => {
        /** Test the root model query for EventProperties */
        it("eventProperties", async () => {
            const eventProperties:
                | I.EventPropertyCountableConnection
                | undefined = await client.eventProperties();
            expect(
                eventProperties instanceof I.EventPropertyCountableConnection
            );
        });
    });

    /** Test Events query */
    describe("Events", () => {
        /** Test the root model query for Events */
        it("events", async () => {
            const events:
                | I.EventCountableConnection
                | undefined = await client.events();
            expect(events instanceof I.EventCountableConnection);
        });
    });

    /** Test OrganizationInviteLink query */
    describe("OrganizationInviteLink", () => {
        /** Test the root model query for OrganizationInviteLink */
        it("organizationInviteLink", async () => {
            const organizationInviteLink:
                | I.OrganizationInviteLink
                | undefined = await client.organizationInviteLink;
            expect(organizationInviteLink instanceof I.OrganizationInviteLink);
        });
    });

    /** Test Persons query */
    describe("Persons", () => {
        /** Test the root model query for Persons */
        it("persons", async () => {
            const persons:
                | I.PersonCountableConnection
                | undefined = await client.persons();
            expect(persons instanceof I.PersonCountableConnection);
        });
    });

    /** Test PropertyDefinitions query */
    describe("PropertyDefinitions", () => {
        /** Test the root model query for PropertyDefinitions */
        it("propertyDefinitions", async () => {
            const propertyDefinitions:
                | I.PropertyDefinitionCountableConnection
                | undefined = await client.propertyDefinitions();
            expect(
                propertyDefinitions instanceof
                    I.PropertyDefinitionCountableConnection
            );
        });
    });

    /** Test Questions query */
    describe("Questions", () => {
        /** Test the root model query for Questions */
        it("questions", async () => {
            const questions:
                | I.SurveyQuestionCountableConnection
                | undefined = await client.questions("mock-id");
            expect(questions instanceof I.SurveyQuestionCountableConnection);
        });
    });

    /** Test Survey query */
    describe("Survey", () => {
        let _survey: I.Survey | undefined;

        /** Test the root model query for Survey */
        it("survey", async () => {
            const survey: I.Survey | undefined = await client.survey();
            _survey = survey;
            expect(survey instanceof I.Survey);
        });

        /** Test the survey model query for Survey_Channels */
        it("survey.channels", async () => {
            if (_survey) {
                const channels:
                    | I.SurveyChannelCountableConnection
                    | undefined = await _survey.channels();
                expect(channels instanceof I.SurveyChannelCountableConnection);
            } else {
                console.warn(
                    "codegen-doc:print: No survey found - cannot test _survey.channels query"
                );
            }
        });

        let _project: I.Project | undefined;

        /** Test the survey model query for Survey_Project */
        it("survey.project", async () => {
            if (_survey) {
                const project: I.Project | undefined = _survey.project;
                _project = project;
                expect(project instanceof I.Project);
            } else {
                console.warn(
                    "codegen-doc:print: No survey found - cannot test _survey.project query"
                );
            }
        });

        /** Test the survey_project model query for Survey_Project_Organization */
        it("survey_project.organization", async () => {
            if (_project) {
                const organization: I.AuthOrganization | undefined =
                    _project.organization;
                expect(organization instanceof I.AuthOrganization);
            } else {
                console.warn(
                    "codegen-doc:print: No project found - cannot test _project.organization query"
                );
            }
        });

        /** Test the survey model query for Survey_Questions */
        it("survey.questions", async () => {
            if (_survey) {
                const questions:
                    | I.SurveyQuestionCountableConnection
                    | undefined = await _survey.questions();
                expect(
                    questions instanceof I.SurveyQuestionCountableConnection
                );
            } else {
                console.warn(
                    "codegen-doc:print: No survey found - cannot test _survey.questions query"
                );
            }
        });

        let _theme: I.ProjectTheme | undefined;

        /** Test the survey model query for Survey_Theme */
        it("survey.theme", async () => {
            if (_survey) {
                const theme: I.ProjectTheme | undefined = _survey.theme;
                _theme = theme;
                expect(theme instanceof I.ProjectTheme);
            } else {
                console.warn(
                    "codegen-doc:print: No survey found - cannot test _survey.theme query"
                );
            }
        });

        let _project: I.Project | undefined;

        /** Test the survey_theme model query for Survey_Theme_Project */
        it("survey_theme.project", async () => {
            if (_theme) {
                const project: I.Project | undefined = _theme.project;
                _project = project;
                expect(project instanceof I.Project);
            } else {
                console.warn(
                    "codegen-doc:print: No theme found - cannot test _theme.project query"
                );
            }
        });
    });

    /** Test Surveys query */
    describe("Surveys", () => {
        /** Test the root model query for Surveys */
        it("surveys", async () => {
            const surveys:
                | I.SurveyCountableConnection
                | undefined = await client.surveys();
            expect(surveys instanceof I.SurveyCountableConnection);
        });
    });

    /** Test Themes query */
    describe("Themes", () => {
        /** Test the root model query for Themes */
        it("themes", async () => {
            const themes:
                | I.ProjectThemeCountableConnection
                | undefined = await client.themes();
            expect(themes instanceof I.ProjectThemeCountableConnection);
        });
    });

    /** Test Viewer query */
    describe("Viewer", () => {
        let _viewer: I.User | undefined;

        /** Test the root model query for Viewer */
        it("viewer", async () => {
            const viewer: I.User | undefined = await client.viewer;
            _viewer = viewer;
            expect(viewer instanceof I.User);
        });

        /** Test the viewer model query for Viewer_Organization */
        it("viewer.organization", async () => {
            if (_viewer) {
                const organization: I.AuthOrganization | undefined =
                    _viewer.organization;
                expect(organization instanceof I.AuthOrganization);
            } else {
                console.warn(
                    "codegen-doc:print: No viewer found - cannot test _viewer.organization query"
                );
            }
        });

        /** Test the viewer model query for Viewer_Organizations */
        it("viewer.organizations", async () => {
            if (_viewer) {
                const organizations:
                    | I.OrganizationCountableConnection
                    | undefined = await _viewer.organizations();
                expect(
                    organizations instanceof I.OrganizationCountableConnection
                );
            } else {
                console.warn(
                    "codegen-doc:print: No viewer found - cannot test _viewer.organizations query"
                );
            }
        });

        let _project: I.Project | undefined;

        /** Test the viewer model query for Viewer_Project */
        it("viewer.project", async () => {
            if (_viewer) {
                const project: I.Project | undefined = _viewer.project;
                _project = project;
                expect(project instanceof I.Project);
            } else {
                console.warn(
                    "codegen-doc:print: No viewer found - cannot test _viewer.project query"
                );
            }
        });

        /** Test the viewer_project model query for Viewer_Project_Organization */
        it("viewer_project.organization", async () => {
            if (_project) {
                const organization: I.AuthOrganization | undefined =
                    _project.organization;
                expect(organization instanceof I.AuthOrganization);
            } else {
                console.warn(
                    "codegen-doc:print: No project found - cannot test _project.organization query"
                );
            }
        });

        /** Test the viewer model query for Viewer_Projects */
        it("viewer.projects", async () => {
            if (_viewer) {
                const projects:
                    | I.ProjectCountableConnection
                    | undefined = await _viewer.projects();
                expect(projects instanceof I.ProjectCountableConnection);
            } else {
                console.warn(
                    "codegen-doc:print: No viewer found - cannot test _viewer.projects query"
                );
            }
        });
    });
});
