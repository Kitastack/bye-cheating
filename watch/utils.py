import base64
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


class Label:
    def __init__(self, name: str, color: tuple[int, int, int]) -> None:
        """label with color (b,g,r), range 0 - 255"""
        self.name = name
        self.color = color
        pass


class_names = [
    Label("Cheat Sheet", (0, 0, 255)),  # Red (BGR)
    Label("Exchange Paper", (0, 165, 255)),  # Orange (BGR)
    Label("Giving Code", (0, 255, 255)),  # Yellow (BGR)
    Label("Looking Friend", (255, 0, 0)),  # Blue (BGR)
    Label("Normal", (0, 128, 0)),  # Green (BGR) (no change)
]


async def disconnect_poller(request: Request, result: Any):
    print("Stopping polling loop")


def cancel_on_disconnect(handler: Callable[[Request], Awaitable[Any]]):

    # Decorator that will check if the client disconnects,
    # and cancel the task if required.
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


def imageToBase64(image: Any):
    return base64.b64encode(image.tobytes()).decode("utf-8")


async def setRedisJson(rd: Redis, key: str, value: dict) -> str:
    value = json.dumps(value)
    await rd.set(key, value)
    return value


async def getRedisJson(rd: Redis, key: str) -> dict:
    if (await rd.exists(key)) == False:
        return None
    value = await rd.get(key)
    if value is None:
        return None
    return json.loads(value)


def delRedis(rd: Redis, key: str):
    rd.delete(key)
    return True
