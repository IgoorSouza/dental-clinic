import request from "supertest";
import express, { Express } from "express";
import ScheduleController from "../../controllers/ScheduleController";
import ScheduleService from "../../services/ScheduleService";
import Schedule from "../../interfaces/schedule";

jest.mock("../../services/ScheduleService");
jest.mock("../../middlewares/AuthGuard", () => ({
  verifyAuthencation: jest.fn((req, res, next) => next()),
}));

const MockScheduleService = ScheduleService as jest.MockedClass<
  typeof ScheduleService
>;

describe("ScheduleController", () => {
  const app: Express = express();
  app.use(express.json());
  new ScheduleController(app);

  it("Should return schedules according to professional id and date", async () => {
    const mockSchedules: Schedule[] = [
      {
        id: "1",
        title: "Consulta",
        description: "Consulta",
        price: 100,
        startTime: "2025-01-05T10:00:00",
        endTime: "2025-01-05T11:00:00",
        professionalId: "1",
        customerId: "1",
      },
    ];

    MockScheduleService.prototype.getSchedulesByProfessionalAndDate.mockResolvedValue(
      mockSchedules
    );

    const response = await request(app).get(
      "/schedules?professionalId=1&date=2025-01-05"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSchedules);
    expect(
      MockScheduleService.prototype.getSchedulesByProfessionalAndDate
    ).toHaveBeenCalledWith("1", "2025-01-05");
  });

  it("Should return error when getting schedules", async () => {
    MockScheduleService.prototype.getSchedulesByProfessionalAndDate.mockRejectedValue(
      new Error("Error while getting schedules.")
    );

    const response = await request(app).get(
      "/schedules?professionalId=1&date=2025-01-05"
    );

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while getting schedules.");
    expect(
      MockScheduleService.prototype.getSchedulesByProfessionalAndDate
    ).toHaveBeenCalledWith("1", "2025-01-05");
  });

  it("Should create schedule", async () => {
    const mockSchedule = {
      title: "Consulta",
      description: "Consulta",
      price: 100,
      startTime: "2025-01-05T10:00:00",
      endTime: "2025-01-05T11:00:00",
      professionalId: "1",
      customerId: "2",
    };
    const expectedSchedule = { ...mockSchedule, id: "1" };

    MockScheduleService.prototype.createSchedule.mockResolvedValue(
      expectedSchedule
    );

    const response = await request(app)
      .post("/schedules/new")
      .send(mockSchedule);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedSchedule);
    expect(MockScheduleService.prototype.createSchedule).toHaveBeenCalledWith(
      mockSchedule
    );
  });

  it("Should return error when creating schedule", async () => {
    const mockSchedule = {
      title: "Consulta",
      description: "Consulta",
      price: 100,
      startTime: "2025-01-05T10:00:00",
      endTime: "2025-01-05T11:00:00",
      professionalId: "1",
      customerId: "2",
    };

    MockScheduleService.prototype.createSchedule.mockRejectedValue(
      new Error("Error while creating schedule.")
    );

    const response = await request(app)
      .post("/schedules/new")
      .send(mockSchedule);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while creating schedule.");
    expect(MockScheduleService.prototype.createSchedule).toHaveBeenCalledWith(
      mockSchedule
    );
  });

  it("Should update schedule", async () => {
    const mockSchedule: Schedule = {
      id: "1",
      title: "Consulta atualizada",
      description: "Consulta atualizada",
      price: 120,
      startTime: "2025-01-05T11:00:00",
      endTime: "2025-01-05T12:00:00",
      professionalId: "1",
      customerId: "1",
    };

    MockScheduleService.prototype.updateSchedule.mockResolvedValue(
      mockSchedule
    );

    const response = await request(app)
      .put("/schedules/update")
      .send(mockSchedule);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSchedule);
    expect(MockScheduleService.prototype.updateSchedule).toHaveBeenCalledWith(
      mockSchedule
    );
  });

  it("Should return error when updating schedule", async () => {
    const mockSchedule: Schedule = {
      id: "1",
      title: "Consulta atualizada",
      description: "Consulta atualizada",
      price: 120,
      startTime: "2025-01-05T11:00:00",
      endTime: "2025-01-05T12:00:00",
      professionalId: "1",
      customerId: "1",
    };

    MockScheduleService.prototype.updateSchedule.mockRejectedValue(
      new Error("Error while updating schedule.")
    );

    const response = await request(app)
      .put("/schedules/update")
      .send(mockSchedule);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while updating schedule.");
    expect(MockScheduleService.prototype.updateSchedule).toHaveBeenCalledWith(
      mockSchedule
    );
  });

  it("Should delete schedule", async () => {
    MockScheduleService.prototype.deleteSchedule.mockResolvedValue();

    const response = await request(app).delete("/schedules/delete/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Schedule successfully deleted.");
    expect(MockScheduleService.prototype.deleteSchedule).toHaveBeenCalledWith(
      "1"
    );
  });

  it("Should return error when deleting schedule", async () => {
    MockScheduleService.prototype.deleteSchedule.mockRejectedValue(
      new Error("Error while deleting schedule.")
    );

    const response = await request(app).delete("/schedules/delete/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while deleting schedule.");
    expect(MockScheduleService.prototype.deleteSchedule).toHaveBeenCalledWith(
      "1"
    );
  });
});
