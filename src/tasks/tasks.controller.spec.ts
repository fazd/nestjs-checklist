import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/models/user.entity';
import { TaskStatus } from './enums/task-status.enum';
import { TasksService } from './services/tasks.service';
import { TasksController } from './tasks.controller';

const mockTasksService = () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  getTaskById: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

const mockFilterDto = {
  status: TaskStatus.OPEN,
  search: 'rfds',
};

const mockUser = {
  username: 'testUser',
};

const mockcreateTaskDto = {
  title: 'testing Title',
  description: 'Testing description',
};

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useFactory: mockTasksService }],
    }).compile();

    tasksController = await module.get<TasksController>(TasksController);
    tasksService = await module.get<TasksService>(TasksService);
  });
  const user = new User();
  user.username = 'testingUser';
  user.password = 'password';
  user.salt = 'salt';

  describe('getTasks', () => {
    it('should call tasksService', () => {
      expect(tasksService.getTasks).not.toHaveBeenCalled();
      tasksController.getTasks(mockFilterDto, user);
      expect(tasksService.getTasks).toHaveBeenCalled();
    });
  });
  describe('createTask', () => {
    it('should call tasksService', () => {
      expect(tasksService.createTask).not.toHaveBeenCalled();
      tasksController.createTask(mockcreateTaskDto, user);
      expect(tasksService.createTask).toHaveBeenCalled();
    });
  });
  describe('getTaskById', () => {
    it('should call tasksService', () => {
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      tasksController.getTaskById(1, user);
      expect(tasksService.getTaskById).toHaveBeenCalled();
    });
  });
  describe('deleteTask', () => {
    it('should call tasksService', () => {
      expect(tasksService.deleteTask).not.toHaveBeenCalled();
      tasksController.deleteTask(1, user);
      expect(tasksService.deleteTask).toHaveBeenCalled();
    });
  });
  describe('updateTaskStatus', () => {
    it('should call tasksService', () => {
      expect(tasksService.updateTaskStatus).not.toHaveBeenCalled();
      tasksController.updateTaskStatus(1, TaskStatus.OPEN, user);
      expect(tasksService.updateTaskStatus).toHaveBeenCalled();
    });
  });
});
