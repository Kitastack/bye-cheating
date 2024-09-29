from fastapi import (
    status as Status,
    Request,
)
from functools import wraps
from typing import Any, Awaitable, Callable
from fastapi import Request, HTTPException
from redis import Redis
from io import BytesIO
import asyncio
import json


class JSONException(Exception):
    def __init__(
        self,
        message: str = "Internal server error",
        statusCode: int = Status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        self.message = message
        self.statusCode = statusCode


async def disconnect_poller(request: Request, result: Any):
    print("Stopping polling loop")


def cancel_on_disconnect(handler: Callable[[Request], Awaitable[Any]]):
    """
    Decorator that will check if the client disconnects,
    and cancel the task if required.
    """

    @wraps(handler)
    async def cancel_on_disconnect_decorator(request: Request, *args, **kwargs):
        sentinel = object()

        # Create two tasks, one to poll the request and check if the
        # client disconnected, and another which is the request handler
        poller_task = asyncio.ensure_future(disconnect_poller(request, sentinel))
        handler_task = asyncio.ensure_future(handler(request, *args, **kwargs))

        done, pending = await asyncio.wait(
            [poller_task, handler_task], return_when=asyncio.FIRST_COMPLETED
        )

        # Cancel any outstanding tasks
        for t in pending:
            t.cancel()

            try:
                await t
            except asyncio.CancelledError:
                print(f"{t} was cancelled")
            except Exception as exc:
                print(f"{t} raised {exc} when being cancelled")

        # Return the result if the handler finished first
        if handler_task in done:
            return await handler_task

        # Otherwise, raise an exception
        # This is not exactly needed, but it will prevent
        # validation errors if your request handler is supposed
        # to return something.
        print("Raising an HTTP error because I was disconnected!!")

        raise HTTPException(503)

    return cancel_on_disconnect_decorator


def setRedisJson(rd: Redis, key: str, value: dict):
    value = json.dumps(value)
    rd.set(key, value)
    return value


def getRedisJson(rd: Redis, key: str):
    value = rd.get(key)
    if value is None:
        return None
    return json.loads(value)


def getKeyPairs(key: str, group: str):
    return str(key) + str("#") + str(group)


def setRedisListGroup(rd: Redis, key: str, group: str, value: str | int):
    key = getKeyPairs(key, group)
    rd.lpush(key, value)
    return value


def getLastElRedisListGroup(rd: Redis, key: str, group: str):
    # get last by the tail
    key = getKeyPairs(key, group)
    return rd.lindex(key, 0)


def getElByKeyRedisListGroup(rd: Redis, key: str, group: str, index: int = 0):
    key = getKeyPairs(key, group)

    return rd.lindex(key, index)


def setRedisGroup(rd: Redis, key: str, group: str, value: str | int):
    key = getKeyPairs(key, group)
    rd.set(key, value)
    return value


def delRedisGroup(rd: Redis, key: str, group: str = None):
    try:
        if group == None:
            term = f"*{key}"
        else:
            term = f"{group}*{key}"
        # delete key items
        for key_found in rd.scan_iter(term):
            print(f"found key to delete {key_found}")
            rd.delete(key_found)
        rd.delete(key)
        return True
    except:
        return False


def delRedis(rd: Redis, key: str):
    rd.delete(key)
    return True


def getRedis(rd: Redis, key: str):
    value = rd.get(key)
    if value is None:
        return None
    return value
