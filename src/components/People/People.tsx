import React from "react";
import { Tooltip } from "@mantine/core";
import { getDefaultPicture, getColorForStringHex } from "../../utils/utils";

interface PeopleProps {
  participants: User[];
  nameMap: StringDict;
  pictureMap: StringDict;
  size?: number;
  accordion?: boolean;
  borderColor?: string;
}

export const People: React.FC<PeopleProps> = ({
  participants,
  nameMap,
  pictureMap,
  size = 40,
  accordion = true,
  borderColor,
}) => {
  if (participants.length === 0) return null;

  const overlap = accordion ? -(size * 0.5) : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ...(borderColor
          ? {
              outline: `2px solid ${borderColor}`,
              outlineOffset: 0,
              borderRadius: size,
            }
          : {}),
      }}
      className="people-container"
    >
      <style>{`.people-container::-webkit-scrollbar { display: none; }`}</style>
      {participants.map((user, i) => {
        const name = nameMap[user.id] || "";
        const pic =
          pictureMap[user.id] ||
          getDefaultPicture(name, getColorForStringHex(user.id));
        return (
          <Tooltip key={user.id} label={name} disabled={!name}>
            <img
              src={pic}
              alt={name}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #17181A",
                marginLeft: i > 0 ? overlap : 0,
                position: "relative",
                zIndex: i + 1,
                cursor: "default",
                transition: "transform 0.07s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.zIndex = "100";
                e.currentTarget.style.transform = "scale(1.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.zIndex = String(i + 1);
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
