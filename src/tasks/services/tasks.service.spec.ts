import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskRepository } from '../models/task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
  username: 'Test',
  id: 12,
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: getTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some Search',
      };
      // call taskService.getTasks
      tasksService.getTasks(filters, mockUser);
      const result = await taskRepository.getTasks(filters, mockUser);
      expect(result).toEqual('someValue');
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('Calls taskRepository and findOne retrieve data', async () => {
      const mockTask = {
        title: 'testTask',
        description: 'Test desc',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('Throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create tasks', () => {
    it('Should create a new user', async () => {
      const mockTaskDTO = {
        title: 'Test',
        description: 'test desct',
      };
      taskRepository.createTask.mockResolvedValue(mockTaskDTO);
      const result = await tasksService.createTask(mockTaskDTO, mockUser);
      expect(result).toBe(mockTaskDTO);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockTaskDTO,
        mockUser,
      );
    });
  });

  describe('DeleteTasks', () => {
    it('calls delete and deletes successfully', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalled();
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
    it('calls delete and deletes successfully', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update Status', () => {
    it('Should update the status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toBe(TaskStatus.DONE);
    });
  });
});
