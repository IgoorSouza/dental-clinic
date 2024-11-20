import ProfessionalRepository from "../repositories/ProfessionalRepository";
import Professional from "../types/professional";

export default class ProfessionalService {
  private professionalRepository: ProfessionalRepository;

  constructor() {
    this.professionalRepository = new ProfessionalRepository();
  }

  async getProfessionals(): Promise<Professional[]> {
    return await this.professionalRepository.getProfessionals();
  }

  async createProfessional(professional: Professional): Promise<Professional> {
    return await this.professionalRepository.createProfessional(professional);
  }

  async updateProfessional(professional: Professional): Promise<Professional> {
    return await this.professionalRepository.updateProfessional(professional);
  }

  async deleteProfessional(id: string): Promise<void> {
    await this.professionalRepository.deleteProfessional(id);
  }
}
