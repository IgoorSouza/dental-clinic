import ProfessionalService from "../../services/ProfessionalService";
import ProfessionalRepository from "../../repositories/ProfessionalRepository";
import Professional from "../../interfaces/professional";

jest.mock("../../repositories/ProfessionalRepository");

const MockProfessionalRepository = ProfessionalRepository as jest.MockedClass<
  typeof ProfessionalRepository
>;

describe("ProfessionalService", () => {
  const professionalService: ProfessionalService = new ProfessionalService();

  it("Should return all professionals", async () => {
    const mockProfessionals: Professional[] = [
      {
        id: "1",
        name: "Dr. Igor Souza de Castro",
        crm: "123456",
        phone: "123456789",
        email: "igor.castro@estudante.iftm.edu.br",
      },
    ];

    MockProfessionalRepository.prototype.getProfessionals.mockResolvedValue(
      mockProfessionals
    );

    const result = await professionalService.getProfessionals();

    expect(result).toEqual(mockProfessionals);
    expect(
      MockProfessionalRepository.prototype.getProfessionals
    ).toHaveBeenCalled();
  });

  it("Should create professional", async () => {
    const mockProfessional: Professional = {
      name: "Dr. Igor Souza de Castro",
      crm: "123456",
      phone: "123456789",
      email: "igor.castro@estudante.iftm.edu.br",
    };
    const expectedProfessional = { ...mockProfessional, id: "1" };

    MockProfessionalRepository.prototype.createProfessional.mockResolvedValue(
      expectedProfessional
    );

    const result = await professionalService.createProfessional(
      mockProfessional
    );

    expect(result).toEqual(expectedProfessional);
    expect(
      MockProfessionalRepository.prototype.createProfessional
    ).toHaveBeenCalledWith(mockProfessional);
  });

  it("Should throw error when creating customer", async () => {
    const mockProfessional: Professional = {
      name: "Dr. Igor Souza",
      crm: "654321",
      phone: "9876543210",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockProfessionalRepository.prototype.createProfessional.mockRejectedValue(
      new Error("Error while creating professional.")
    );

    await expect(
      professionalService.createProfessional(mockProfessional)
    ).rejects.toThrow("Error while creating professional.");
    expect(
      MockProfessionalRepository.prototype.createProfessional
    ).toHaveBeenCalledWith(mockProfessional);
  });

  it("Should update professional", async () => {
    const mockProfessional: Professional = {
      id: "1",
      name: "Dr. Igor Souza",
      crm: "654321",
      phone: "9876543210",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockProfessionalRepository.prototype.updateProfessional.mockResolvedValue(
      mockProfessional
    );

    const result = await professionalService.updateProfessional(
      mockProfessional
    );

    expect(result).toEqual(mockProfessional);
    expect(
      MockProfessionalRepository.prototype.updateProfessional
    ).toHaveBeenCalledWith(mockProfessional);
  });

  it("Should throw error when updating professional", async () => {
    const mockProfessional: Professional = {
      id: "1",
      name: "Dr. Igor Souza",
      crm: "654321",
      phone: "9876543210",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockProfessionalRepository.prototype.updateProfessional.mockRejectedValue(
      new Error("Error while updating professional.")
    );
    await expect(
      professionalService.updateProfessional(mockProfessional)
    ).rejects.toThrow("Error while updating professional.");
  });

  it("Should delete professional", async () => {
    MockProfessionalRepository.prototype.deleteProfessional.mockResolvedValue();

    await professionalService.deleteProfessional("1");

    expect(
      MockProfessionalRepository.prototype.deleteProfessional
    ).toHaveBeenCalledWith("1");
  });

  it("Should throw error when deleting professional", async () => {
    MockProfessionalRepository.prototype.deleteProfessional.mockRejectedValue(
      new Error("Error deleting professional.")
    );

    await expect(professionalService.deleteProfessional("1")).rejects.toThrow(
      "Error deleting professional."
    );
    expect(
      MockProfessionalRepository.prototype.deleteProfessional
    ).toHaveBeenCalledWith("1");
  });
});
