import useSWR from "swr";

import {
  editMethodInAction,
  editParamInAction,
  newParamInAction,
  storeStage,
} from "@/store/store";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EditStage() {
  const { data, error } = useSWR(
    "https://dev.artux.net/pdanetwork/items/all",
    fetcher
  );

  console.log(data, error);

  return (
    <div className="stage-card">
      {Object.entries(storeStage.actions).map(
        (action: any, indexAction: number) => (
          <div>
            Операция:{" "}
            <input
              type="text"
              onChange={(e) => {
                editMethodInAction(e.target.value, indexAction);
              }}
              defaultValue={action[0]}
            />
            <div>
              <div style={{ display: "flex" }}>
                Значения: <div className="mx-auto"></div>
                <button
                  onClick={() => {
                    newParamInAction(indexAction);
                  }}
                >
                  +
                </button>
              </div>
              {action[1].map((key: any, index: number) => (
                <input
                  type="text"
                  defaultValue={key}
                  onChange={(e) =>
                    editParamInAction(e.target.value, indexAction, index)
                  }
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
