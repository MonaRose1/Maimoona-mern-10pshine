import { expect } from 'chai';
import sinon from 'sinon';
import { errorHandler, asyncHandler, notFoundHandler } from '../../middleware/errorHandler.js';
import { AppError, BadRequestError, UnauthorizedError, NotFoundError } from '../../utils/errors.js';

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/test'
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Test error', 400);
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.equal('Test error');
    });

    it('should handle BadRequestError', () => {
      const error = new BadRequestError('Invalid input');
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.equal('Invalid input');
    });

    it('should handle UnauthorizedError', () => {
      const error = new UnauthorizedError('Not authenticated');
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.equal('Not authenticated');
    });

    it('should handle NotFoundError', () => {
      const error = new NotFoundError('Resource not found');
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.equal('Resource not found');
    });

    it('should handle MongoDB duplicate key error', () => {
      const error = {
        code: 11000,
        keyPattern: { email: 1 },
        message: 'Duplicate key'
      };
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(409)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.include('email already exists');
    });

    it('should handle MongoDB CastError', () => {
      const error = {
        name: 'CastError',
        path: '_id',
        value: 'invalid-id',
        message: 'Cast failed'
      };
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.include('Invalid _id');
    });

    it('should handle unknown errors in production', () => {
      const error = new Error('Unknown error');
      process.env.NODE_ENV = 'production';

      errorHandler(error, req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      const responseArg = res.json.firstCall.args[0];
      expect(responseArg.message).to.equal('Something went wrong. Please try again later.');
    });

    it('should include stack trace in development', () => {
      const error = new AppError('Test error', 400);
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      errorHandler(error, req, res, next);

      const responseArg = res.json.firstCall.args[0];
      expect(responseArg).to.have.property('stack');
      
      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('asyncHandler', () => {
    it('should catch async errors and pass to next', async () => {
      const asyncFn = asyncHandler(async (req, res, next) => {
        throw new Error('Async error');
      });

      await asyncFn(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].message).to.equal('Async error');
    });

    it('should not call next if no error', async () => {
      const asyncFn = asyncHandler(async (req, res, next) => {
        res.json({ success: true });
      });

      await asyncFn(req, res, next);

      expect(next.called).to.be.false;
    });
  });

  describe('notFoundHandler', () => {
    it('should create 404 error for unknown routes', () => {
      notFoundHandler(req, res, next);

      expect(next.calledOnce).to.be.true;
      const error = next.firstCall.args[0];
      expect(error).to.be.instanceOf(AppError);
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.include('/test');
    });
  });
});
