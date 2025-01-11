import ScheduleService from "../../services/ScheduleService";
import ScheduleRepository from "../../repositories/ScheduleRepository";
import Schedule from "../../interfaces/schedule";

jest.mock("../../repositories/ScheduleRepository");

const MockScheduleRepository = ScheduleRepository as jest.MockedClass<
  typeof ScheduleRepository
>;

describe("ScheduleService", () => {
  let scheduleService: ScheduleService;

  beforeEach(() => {
    scheduleService = new ScheduleService();
  });

  it("Should return schedules for a professional on a specific day", async () => {
    const professionalId = "1";
    const day = "2025-01-05";
    const mockSchedules: Schedule[] = [
      {
        id: "1",
        title: "Consulta 1",
        description: "Descrição",
        price: 100,
        startTime: new Date("2025-01-05T08:00:00"),
        endTime: new Date("2025-01-05T09:00:00"),
        professionalId,
        customerId: "2",
      },
    ];

    MockScheduleRepository.prototype.getSchedulesByProfessionalAndDate.mockResolvedValue(
      mockSchedules
    );

    const result = await scheduleService.getSchedulesByProfessionalAndDate(
      professionalId,
      day
    );

    expect(result).toEqual(mockSchedules);
    expect(
      MockScheduleRepository.prototype.getSchedulesByProfessionalAndDate
    ).toHaveBeenCalledWith(professionalId, expect.any(Date), expect.any(Date));
  });

  it("Should create schedule", async () => {
    const newSchedule: Schedule = {
      title: "Consulta",
      description: "Descrição",
      price: 100,
      startTime: new Date("2025-01-05T08:00:00"),
      endTime: new Date("2025-01-05T09:00:00"),
      professionalId: "1",
      customerId: "2",
    };

    jest
      .spyOn(scheduleService as any, "isScheduleAvailable")
      .mockResolvedValue(true);

    MockScheduleRepository.prototype.createSchedule.mockResolvedValue(
      newSchedule
    );

    const result = await scheduleService.createSchedule(newSchedule);

    expect(result).toEqual(newSchedule);
    expect(
      MockScheduleRepository.prototype.createSchedule
    ).toHaveBeenCalledWith(newSchedule);
  });

  it("Should throw an error if schedule is not available", async () => {
    const newSchedule: Schedule = {
      title: "Consulta",
      description: "Descrição",
      price: 100,
      startTime: new Date("2025-01-05T08:00:00"),
      endTime: new Date("2025-01-05T09:00:00"),
      professionalId: "1",
      customerId: "2",
    };

    jest
      .spyOn(scheduleService as any, "isScheduleAvailable")
      .mockResolvedValue(false);

    await expect(scheduleService.createSchedule(newSchedule)).rejects.toThrow(
      "Schedule is not available."
    );
  });

  it("Should update schedule", async () => {
    const updatedSchedule: Schedule = {
      id: "1",
      title: "Consulta Atualizada",
      description: "Descrição Atualizada",
      price: 150,
      startTime: new Date("2025-01-05T10:00:00"),
      endTime: new Date("2025-01-05T11:00:00"),
      professionalId: "1",
      customerId: "2",
    };

    jest
      .spyOn(scheduleService as any, "isScheduleAvailable")
      .mockResolvedValue(true);

    MockScheduleRepository.prototype.updateSchedule.mockResolvedValue(
      updatedSchedule
    );

    const result = await scheduleService.updateSchedule(updatedSchedule);

    expect(result).toEqual(updatedSchedule);
    expect(
      MockScheduleRepository.prototype.updateSchedule
    ).toHaveBeenCalledWith(updatedSchedule);
  });

  it("Should throw an error if schedule is not available", async () => {
    const updatedSchedule: Schedule = {
      id: "1",
      title: "Consulta Atualizada",
      description: "Descrição Atualizada",
      price: 150,
      startTime: new Date("2025-01-05T10:00:00"),
      endTime: new Date("2025-01-05T11:00:00"),
      professionalId: "1",
      customerId: "2",
    };

    jest
      .spyOn(scheduleService as any, "isScheduleAvailable")
      .mockResolvedValue(false);

    await expect(
      scheduleService.updateSchedule(updatedSchedule)
    ).rejects.toThrow("Schedule is not available.");
  });

  it("Should delete schedule", async () => {
    const scheduleId = "1";

    MockScheduleRepository.prototype.deleteSchedule.mockResolvedValue();

    await scheduleService.deleteSchedule(scheduleId);

    expect(
      MockScheduleRepository.prototype.deleteSchedule
    ).toHaveBeenCalledWith(scheduleId);
  });

  it("Should return false if there's an overlapping schedule", async () => {
    const professionalId = "1";
    const newStartTime = new Date("2025-01-05T08:30:00");
    const newEndTime = new Date("2025-01-05T09:30:00");

    const mockSchedules: Schedule[] = [
      {
        id: "2",
        title: "Consulta 1",
        description: "Descrição",
        price: 100,
        startTime: new Date("2025-01-05T08:00:00"),
        endTime: new Date("2025-01-05T09:00:00"),
        professionalId,
        customerId: "3",
      },
    ];

    MockScheduleRepository.prototype.getSchedulesByProfessional.mockResolvedValue(
      mockSchedules
    );

    const result = await scheduleService["isScheduleAvailable"](
      professionalId,
      newStartTime,
      newEndTime
    );

    expect(result).toBe(false);
    expect(
      MockScheduleRepository.prototype.getSchedulesByProfessional
    ).toHaveBeenCalledWith(professionalId);
  });

  it("Should return true if schedule is available", async () => {
    const professionalId = "1";
    const newStartTime = new Date("2025-01-05T10:00:00");
    const newEndTime = new Date("2025-01-05T11:00:00");

    const mockSchedules: Schedule[] = [
      {
        id: "2",
        title: "Consulta 1",
        description: "Descrição",
        price: 100,
        startTime: new Date("2025-01-05T08:00:00"),
        endTime: new Date("2025-01-05T09:00:00"),
        professionalId,
        customerId: "3",
      },
    ];

    MockScheduleRepository.prototype.getSchedulesByProfessional.mockResolvedValue(
      mockSchedules
    );

    const result = await scheduleService["isScheduleAvailable"](
      professionalId,
      newStartTime,
      newEndTime
    );

    expect(result).toBe(true);
    expect(
      MockScheduleRepository.prototype.getSchedulesByProfessional
    ).toHaveBeenCalledWith(professionalId);
  });

  it("Should return false if schedule is unavailable", async () => {
    const professionalId = "1";
    const newStartTime = new Date("2025-01-05T07:00:00");
    const newEndTime = new Date("2025-01-05T10:00:00");

    const mockSchedules: Schedule[] = [
      {
        id: "2",
        title: "Consulta 1",
        description: "Descrição",
        price: 100,
        startTime: new Date("2025-01-05T08:00:00"),
        endTime: new Date("2025-01-05T09:00:00"),
        professionalId,
        customerId: "3",
      },
    ];

    MockScheduleRepository.prototype.getSchedulesByProfessional.mockResolvedValue(
      mockSchedules
    );

    const result = await scheduleService["isScheduleAvailable"](
      professionalId,
      newStartTime,
      newEndTime
    );

    expect(result).toBe(false);
    expect(
      MockScheduleRepository.prototype.getSchedulesByProfessional
    ).toHaveBeenCalledWith(professionalId);
  });
});
