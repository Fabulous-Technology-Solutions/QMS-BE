import * as accountService from './account.services';
import  { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
// import AppiError from '../errors/ApiError';

export const getAllAccounts = catchAsync(async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const accounts = await accountService.getAllAccounts(accountId as string, Number(req.query['page']), Number(req.query['limit']), req.query['search' ] as string);
  res.status(200).json({
    status: 'success',
    data: accounts,
  });
});

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { accountId } = req.params;
   await accountService.deleteAccountById(accountId as string);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAccountById = catchAsync(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const account = await accountService.getAccountById(accountId as string) ;
    res.status(200).json({
      status: 'success',
      data: account,
    });
});
export const updateAccount = catchAsync(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const updateData = req.body;
    const updatedAccount = await accountService.updateAccountById(accountId as string, updateData);
    res.status(200).json({
        status: 'success',
        data: {
            account: updatedAccount,
        },
    });
});
export const switchAccountController = catchAsync(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const account = await accountService.switchAccount(req.user!._id, accountId as string);
    res.status(200).json({
        status: 'success',
        data: {
            account,
        },
    });
});