import Joi from 'joi'
import { ROLE } from '@libs/constant.lib'
import { isValidSchema } from '@libs/joi.lib'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '@libs/error.lib'
import { Request, Response, NextFunction } from 'express'

const urlRegex = new RegExp(/^rtsp:\/\/[^\s]+$/)
const urlValidation = Joi.string().pattern(urlRegex).messages({
  'string.pattern.base': 'protocol must be only rtsp'
})
/**
 * [POST] Create stream for logged user.
 */
export const createStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await isValidSchema(
      Joi.object({
        id: Joi.string().uuid().optional(),
        url: urlValidation.required()
      }).required(),
      req.body
    )
    if (
      (await database.stream.count({
        where: {
          url: {
            contains: req.body.url
          },
          userId: req.user?.id
        }
      })) > 0
    ) {
      throw new BadRequestError(`you already have this url ${req.body.url}`)
    }
    const createdStream = await database.$transaction(async (ctx) => {
      const stream = await ctx.stream.create({
        data: {
          ...req.body,
          userId: req.user?.id
        }
      })
      await ctx.audit.create({
        data: {
          entityId: stream.id,
          entityName: 'stream',
          fieldName: JSON.stringify(Object.keys(stream)),
          fieldValue: JSON.stringify(stream),
          userId: req.user!.id
        }
      })
      return stream
    })
    res.status(StatusCodes.CREATED).json({
      success: true,
      result: createdStream
    })
  } catch (error) {
    next(error)
  }
}
/**
 * [PATCH] Stream data edit for logged user or admin.
 */
export const updateStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await isValidSchema(
      Joi.object({
        id: Joi.string().uuid().required(),
        url: urlValidation.optional()
      }).required(),
      req.body
    )
    if (
      !(
        (await database.stream.count({
          where: {
            id: req.body.id
          }
        })) > 0
      )
    ) {
      throw new BadRequestError(`stream with id ${req.body.id} not found`)
    }
    if (!(Object.keys(req.body).length > 1)) {
      throw new BadRequestError('body atleast have something to update with')
    }
    const updatedStream = await database.$transaction(async (ctx) => {
      const stream = await ctx.stream.update({
        where: {
          id: req.body.id
        },
        data: {
          ...req.body,
          updatedDate: new Date()
        }
      })
      await ctx.audit.create({
        data: {
          entityId: stream.id,
          entityName: 'stream',
          fieldName: JSON.stringify(Object.keys(req.body)),
          fieldValue: JSON.stringify(req.body),
          userId: req.user!.id
        }
      })
      return stream
    })
    res.status(StatusCodes.OK).json({
      success: true,
      result: updatedStream
    })
  } catch (error) {
    next(error)
  }
}
/**
 * [GET] Stream data for logged user as admin or not.
 */
export const getStream = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await isValidSchema(
      Joi.object({
        id: Joi.string().uuid().optional(),
        userId: Joi.string().uuid().optional(),
        url: urlValidation.optional()
      }).prefs({ convert: true }),
      req.populatedQuery
    )
    const orQuery: any[] = []
    if (req.populatedQuery?.id) {
      orQuery.push({
        id: req.populatedQuery?.id
      })
    }
    if (req.populatedQuery?.url) {
      orQuery.push({
        url: {
          contains: req.populatedQuery?.url
        }
      })
    }
    const foundStreams = await database.stream.findMany({
      where: {
        OR: orQuery?.length > 0 ? orQuery : undefined,
        userId: req.user?.roles?.includes(ROLE.Admin)
          ? ((req.populatedQuery?.userId as string) ?? undefined)
          : req.user?.id
      },
      skip: req.page,
      take: req.limit
    })
    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      result: foundStreams
    })
  } catch (error) {
    next(error)
  }
}
