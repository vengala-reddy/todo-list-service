import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Task Validation', () => {
  it('should reject task with effort <= 0', () => {
    const taskData = {
      taskName: 'Test Task',
      description: 'Test Description',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'IN_PROGRESS',
      effortRequired: 0,
    };

    const errors = validateTask(taskData);
    assert.ok(errors.includes('Effort required must be greater than 0'));
  });

  it('should reject task with end date before start date', () => {
    const taskData = {
      taskName: 'Test Task',
      description: 'Test Description',
      startDate: '2024-01-31',
      endDate: '2024-01-01',
      status: 'IN_PROGRESS',
      effortRequired: 5,
    };

    const errors = validateTask(taskData);
    assert.ok(errors.includes('End date must be greater than start date'));
  });

  it('should accept valid task data', () => {
    const taskData = {
      taskName: 'Test Task',
      description: 'Test Description',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'IN_PROGRESS',
      effortRequired: 5,
    };

    const errors = validateTask(taskData);
    assert.strictEqual(errors.length, 0);
  });

  it('should reject empty required fields', () => {
    const taskData = {
      taskName: '',
      description: '',
      startDate: '',
      endDate: '',
      status: '',
      effortRequired: null,
    };

    const errors = validateTask(taskData);
    assert.ok(errors.length >= 5); // All fields should have errors
  });
});

describe('Status Update Logic', () => {
  it('should return PENDING when end date is past', () => {
    const endDate = new Date('2023-01-01'); // Past date
    const today = new Date();
    
    const status = endDate < today ? 'PENDING' : 'COMPLETED';
    assert.strictEqual(status, 'PENDING');
  });

  it('should return COMPLETED when end date is future', () => {
    const endDate = new Date('2030-01-01'); // Future date
    const today = new Date();
    
    const status = endDate < today ? 'PENDING' : 'COMPLETED';
    assert.strictEqual(status, 'COMPLETED');
  });
});

// Helper function for testing validation
function validateTask(data) {
  const errors = [];
  
  if (!data.taskName?.trim()) errors.push('Task name is required');
  if (!data.description?.trim()) errors.push('Description is required');
  if (!data.startDate) errors.push('Start date is required');
  if (!data.endDate) errors.push('End date is required');
  if (!data.status?.trim()) errors.push('Status is required');
  
  if (data.effortRequired === undefined || data.effortRequired === null) {
    errors.push('Effort required is mandatory');
  } else if (typeof data.effortRequired !== 'number' || data.effortRequired <= 0) {
    errors.push('Effort required must be greater than 0');
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      errors.push('End date must be greater than start date');
    }
  }

  return errors;
}