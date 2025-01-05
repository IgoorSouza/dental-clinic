import request from "supertest";
import express, { Express } from "express";
import ProfessionalController from "../../controllers/ProfessionalController";
import ProfessionalService from "../../services/ProfessionalService";
import Professional from "../../interfaces/professional";

jest.mock("../../services/ProfessionalService");
jest.mock("../../middlewares/AuthGuard", () => ({
  verifyAuthencation: jest.fn((req, res, next) => next()),
}));

const MockProfessionalService = ProfessionalService as jest.MockedClass<
  typeof ProfessionalService
>;

describe("ProfessionalController", () => {
  const app: Express = express();
  app.use(express.json());
  new ProfessionalController(app);

  it("Should return all professionals", async () => {
    const mockProfessionals: Professional[] = [
      {
        id: "1",
        name: "Igor Souza de Castro",
        crm: "12345",
        phone: "123456789",
        email: "igor.castro@estudante.iftm.edu.br",
      },
      {
        id: "2",
        name: "Pedro Henrique Lopes",
        crm: "67890",
        phone: null,
        email: null,
      },
    ];
    MockProfessionalService.prototype.getProfessionals.mockResolvedValue(
      mockProfessionals
    );

    const response = await request(app).get("/professionals");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProfessionals);
    expect(
      MockProfessionalService.prototype.getProfessionals
    ).toHaveBeenCalled();
  });

  it("Should return error when getting professionals", async () => {
    MockProfessionalService.prototype.getProfessionals.mockRejectedValue(
      new Error("Error while getting professionals.")
    );

    const response = await request(app).get("/professionals");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while getting professionals.");
  });

  it("Should create professional", async () => {
    const newProfessional: Professional = {
      id: "1",
      name: "Igor Souza de Castro",
      crm: "12345",
      phone: "123456789",
      email: "igor.castro@estudante.iftm.edu.br",
    };

    MockProfessionalService.prototype.createProfessional.mockResolvedValue(
      newProfessional
    );

    const response = await request(app)
      .post("/professionals/new")
      .send(newProfessional);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newProfessional);
    expect(
      MockProfessionalService.prototype.createProfessional
    ).toHaveBeenCalledWith(newProfessional);
  });

  it("Should return error when creating a professional", async () => {
    MockProfessionalService.prototype.createProfessional.mockRejectedValue(
      new Error("Error while creating professional.")
    );

    const response = await request(app)
      .post("/professionals/new")
      .send({ name: "" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while creating professional.");
  });

  it("Should update professional", async () => {
    const updatedProfessional: Professional = {
      id: "1",
      name: "Igor Souza",
      crm: "12345",
      phone: "987654321",
      email: "igor.souza@estudante.iftm.edu.br",
    };

    MockProfessionalService.prototype.updateProfessional.mockResolvedValue(
      updatedProfessional
    );

    const response = await request(app)
      .put("/professionals/update")
      .send(updatedProfessional);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedProfessional);
    expect(
      MockProfessionalService.prototype.updateProfessional
    ).toHaveBeenCalledWith(updatedProfessional);
  });

  it("Should return error when updating a professional", async () => {
    MockProfessionalService.prototype.updateProfessional.mockRejectedValue(
      new Error("Error while updating professional.")
    );

    const response = await request(app)
      .put("/professionals/update")
      .send({ id: "", name: "" });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while updating professional.");
  });

  it("Should delete professional", async () => {
    const professionalId = "1";

    MockProfessionalService.prototype.deleteProfessional.mockResolvedValue();

    const response = await request(app).delete(
      `/professionals/delete/${professionalId}`
    );

    expect(response.status).toBe(200);
    expect(response.text).toBe("Professional successfully deleted.");
    expect(
      MockProfessionalService.prototype.deleteProfessional
    ).toHaveBeenCalledWith(professionalId);
  });

  it("Should return error when deleting a professional", async () => {
    MockProfessionalService.prototype.deleteProfessional.mockRejectedValue(
      new Error("Error while deleting professional.")
    );

    const response = await request(app).delete("/professionals/delete/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error while deleting professional.");
  });
});
