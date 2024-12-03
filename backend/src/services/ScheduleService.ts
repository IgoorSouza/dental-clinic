import Schedule from "../interfaces/schedule";
import ScheduleRepository from "../repositories/ScheduleRepository";

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
      new Date(startTime),
      new Date(endTime)
    );

    if (!isScheduleAvailable) throw new Error("Schedule is not available.");

    return await this.scheduleRepository.createSchedule(schedule);
  }

  async updateSchedule(schedule: Schedule): Promise<Schedule> {
    const { id, professionalId, startTime, endTime } = schedule;
    const isScheduleAvailable = await this.isScheduleAvailable(
      professionalId,
      new Date(startTime),
      new Date(endTime),
      id
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
    endTime: Date,
    id?: string
  ): Promise<boolean> {
    const schedules = await this.scheduleRepository.getSchedulesByProfessional(
      professionalId
    );

    for (const schedule of schedules) {
      if (
        schedule.id !== id &&
        ((startTime >= schedule.startTime && endTime <= schedule.endTime) ||
          (startTime <= schedule.startTime && endTime >= schedule.endTime) ||
          (startTime >= schedule.startTime && startTime < schedule.endTime) ||
          (endTime > schedule.startTime && endTime <= schedule.endTime))
      ) {
        return false;
      }
    }

    return true;
  }
}
