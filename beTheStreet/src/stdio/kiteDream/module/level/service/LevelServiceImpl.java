package stdio.kiteDream.module.level.service;

import java.io.File;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import stdio.kiteDream.module.coins.bean.Coins;
import stdio.kiteDream.module.coins.dao.CoinsDao;
import stdio.kiteDream.module.image.bean.Image;
import stdio.kiteDream.module.image.bean.Image.Check;
import stdio.kiteDream.module.image.dao.ImageDao;
import stdio.kiteDream.module.image.service.ImageService;
import stdio.kiteDream.module.level.bean.Level;
import stdio.kiteDream.module.level.bean.Level.LevelState;
import stdio.kiteDream.module.level.dao.LevelDao;
import stdio.kiteDream.module.message.bean.Message;
import stdio.kiteDream.module.message.bean.MessageType;
import stdio.kiteDream.module.message.service.MessageService;
import stdio.kiteDream.module.user.bean.Group;
import stdio.kiteDream.module.user.bean.User;
import stdio.kiteDream.module.user.dao.GroupDao;
import stdio.kiteDream.module.user.dao.UserDao;
import stdio.kiteDream.util.Constant;

@Service
public class LevelServiceImpl implements LevelService {
	
	@Autowired
	LevelDao levelDao;
	@Autowired
	UserDao userDao;
	@Autowired
	CoinsDao coinsDao;
	@Autowired
	GroupDao groupDao;
	@Autowired
	ImageDao imageDao;
	@Autowired
	MessageService messageService;

	@Override
	public Level getPrizeRule(String id) {
		return levelDao.getLevel(id);
	}

	@Override
	public Level getLevel(int level) {
		return levelDao.getLevel(level);
	}

	@Override
	public boolean saveLevel(Level rule) {
		return levelDao.saveLevel(rule);
	}

	@Override
	public boolean deleteLevel(String id,String realContextPath) {
		try {
			Level oldLevel = levelDao.getLevel(id);
			File oldHeadPhoto = new File(realContextPath+"/"+oldLevel.getPath());
			File oldThumbnail_path = new File(realContextPath+"/"+oldLevel.getThumbnail_path());
			if(oldHeadPhoto.isFile()){
				oldHeadPhoto.delete();
			}
			if(oldThumbnail_path.isFile()){
				oldThumbnail_path.delete();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return levelDao.deleteLevel(id);
	}

	@Override
	public List<Level> getLevels(int userid) {
		List<Level> levels = levelDao.getLevel();
		if(userid>0){
			User user = userDao.getUser(userid+"");
			for(Level level:levels){
				if(level.getLevel()<user.getHigh_level()){
					level.setState(LevelState.REPLAY);
				}else if(level.getLevel()>user.getHigh_level()){
					level.setState(LevelState.LOCK);
				}else{
					level.setState(LevelState.PLAYING);
				}
			}
		}
		return levels;
	}

	@Override
	public boolean managePrize(String imageId, String userid) {
		try {
			Image image = imageDao.getImage(imageId);
			if(image==null||image.getCoins()==null){
				return false;
			}
				User user = userDao.getUser(userid);
				if(user.getCoins()!=null){
					user.getCoins().setGreenNum(user.getCoins().getGreenNum()+image.getCoins().getGreenNum());
					user.getCoins().setYellowNum(user.getCoins().getYellowNum()+image.getCoins().getYellowNum());
					user.getCoins().setRedNum(user.getCoins().getRedNum()+image.getCoins().getRedNum());
				}else{
					Coins coins = new Coins();
					coins.setGreenNum(image.getCoins().getGreenNum());
					coins.setYellowNum(image.getCoins().getYellowNum());
					coins.setRedNum(image.getCoins().getRedNum());
					coinsDao.saveCoins(coins);
					user.setCoins(coins);
				}
				Group group = user.getGroup();
				if(group!=null){
					Coins coins = group.getCoins();
					if(coins!=null){
						coins.setGreenNum(coins.getGreenNum()+image.getCoins().getGreenNum());
						coins.setYellowNum(coins.getYellowNum()+image.getCoins().getYellowNum());
						coins.setRedNum(coins.getRedNum()+image.getCoins().getRedNum());
					}else{
						coins = new Coins();
						coins.setGreenNum(image.getCoins().getGreenNum());
						coins.setYellowNum(image.getCoins().getYellowNum());
						coins.setRedNum(image.getCoins().getRedNum());
						group.setCoins(coins);
					}
					coinsDao.saveCoins(coins);
					groupDao.saveGroup(group);
				}
				userDao.saveUser(user);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	@Override
	public Coins getUserCoins(int userid) {
		return coinsDao.getUserCoins(userid+"");
	}

	@Override
	public int getCount() {
		return levelDao.getCount();
	}

	@Override
	public Level getLevelById(int id) {
		return levelDao.getLevel(id+"");
	}

	@Override
	public String manageAccessChallenge(int userid) {
		User user = userDao.getUser(userid+"");
		user.setReadyChallenge(true);
		userDao.saveUser(user);
		if(user.isIngroup()){
			List<Image> images = imageDao.getUserBonusImage(userid);
			if(images.size()>3){
				int count = 0;
				for(Image image:images){
					if(Check.PASS.equals(image.getStatu())){
						count++;
					}
				}
				if(count>=2){
					//send message;
					Level level = levelDao.getLevel(6);
					Message message = new Message();
					message.setCreate_time(new Date());
					message.setDescription(level.getTitle()+":"+level.getShortdesc()+"   "+level.getDesc());
					message.setTitle(level.getTitle()+" Unlocked!");
					message.setType(MessageType.CHALLENGE);
					message.setLevel(level.getLevel());
					messageService.saveMessage(message, userid+"");
					return Constant.OK;
				}else{
					Message message = new Message();
					message.setCreate_time(new Date());
					message.setDescription("please wait 1 day,administrator will check you photo!!!");
					message.setTitle("please Waiting!!!");
					message.setType(MessageType.NOTICE);
					messageService.saveMessage(message, userid+"");
					return "wait";
				}
			}else{
				return "skip";
			}
		}else{
			return "join";
		}
	}

}
