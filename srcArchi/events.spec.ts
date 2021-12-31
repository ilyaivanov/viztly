import { createSource, on, trigger } from "./events";

it("sample", () => {
  type EventsMap = {
    "glorius-event": { payload: number };
    "yet-another-glorius-event": { isPikachu: boolean };
  };
  const events = createSource<EventsMap>();

  const fn = jest.fn();

  on(events, "glorius-event", (arg) => {
    console.log(arg);
    fn(arg);
  });

  expect(fn).not.toHaveBeenCalled();

  trigger(events, "glorius-event", { payload: 1 });

  expect(fn).toHaveBeenCalledWith({ payload: 1 });
});
