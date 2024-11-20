import ScheduleRepository from "../repositories/ScheduleRepository";
import Schedule from "../types/schedule";

export default class ScheduleService {
  private scheduleRepository: ScheduleRepository;

  constructor() {
    this.scheduleRepository = new ScheduleRepository();
  }

  async getSchedulesByProfessionalAndDate(
    professionalId: string,
    day: string
  ): Promise<Schedule[]> {
    const date = new Date(day);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    return await this.scheduleRepository.getSchedulesByProfessionalAndDate(
      professionalId,
      date,
      nextDate
    );
  }

  async createSchedule(schedule: Schedule): Promise<Schedule> {
    const { professionalId, startTime, endTime } = schedule;
    const isScheduleAvailable = await this.isScheduleAvailable(
      professionalId,
      startTime,
      endTime
    );

    if (!isScheduleAvailable) throw new Error("Schedule is not available.");

    return await this.scheduleRepository.createSchedule(schedule);
  }

  async updateSchedule(schedule: Schedule): Promise<Schedule> {
    const { professionalId, startTime, endTime } = schedule;
    const isScheduleAvailable = await this.isScheduleAvailable(
      professionalId,
      startTime,
      endTime
    );

    if (!isScheduleAvailable) throw new Error("Schedule is not available.");

    return await this.scheduleRepository.updateSchedule(schedule);
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.scheduleRepository.deleteSchedule(id);
  }

  private async isScheduleAvailable(
    professionalId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    const schedules = await this.scheduleRepository.getSchedulesByProfessionalAndDate(
      professionalId,
      startTime,
      endTime
    );

    for (const schedule of schedules) {
      if (
        (startTime >= schedule.startTime && startTime < schedule.endTime) ||
        (endTime > schedule.startTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && endTime >= schedule.endTime)
      ) {
        return false;
      }
    }

    return true;
  }
}